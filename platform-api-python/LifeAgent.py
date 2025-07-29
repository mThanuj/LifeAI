import os
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings

from langchain_community.document_loaders import  (
    TextLoader, PDFPlumberLoader, UnstructuredFileLoader
)
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

def load_documents_from_folder(path_str):
    """Load documents from a folder or a single file in supported formats."""
    docs = []
    supported_loaders = {
        ".txt": TextLoader,
        ".pdf": PDFPlumberLoader,
        ".csv": UnstructuredFileLoader,
        ".docx": UnstructuredFileLoader,
        ".pptx": UnstructuredFileLoader,
        ".html": UnstructuredFileLoader,
    }

    path = Path(path_str)

    def load_file(file_path):
        ext = file_path.suffix.lower()
        loader_cls = supported_loaders.get(ext)
        if loader_cls:
            try:
                loader = loader_cls(str(file_path))
                return loader.load()
            except Exception as e:
                print(f"[Error] Failed to load {file_path.name}: {e}")
        else:
            print(f"[Warning] Unsupported format: {file_path.name}")
        return []

    if path.is_file():
        docs.extend(load_file(path))
    elif path.is_dir():
        for file in path.iterdir():
            docs.extend(load_file(file))
    else:
        print(f"[Error] Invalid path: {path_str}")

    return docs

def launch_chatbot(
    google_api_key,
    document_folder,
    persist_dir
):
    # Set API Key
    os.environ["GOOGLE_API_KEY"] = google_api_key

    # Initialize LLM and embeddings
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.7)
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

 

# Define custom prompt
    prompt = PromptTemplate(

    input_variables=["context", "question"],
    template="""
            You are an excellent advisor. Use the following context to help answer the user's question.
            If the answer is not in the context, respond honestly that you don’t know.

            Context:
            {context}

            Question:
            {question}

            Answer:"""
)


    # Load and process documents from the folder
    documents = load_documents_from_folder(document_folder)

    if not documents:
        print("No documents loaded. Check the folder or supported formats.")
        return

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    # Create ChromaDB
    db = Chroma.from_documents(docs, embedding, persist_directory=persist_dir)

    # Setup retrieval chain
    retriever = db.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True,
        input_key="question"
    )

    # Start chatbot loop
    print("🤖 Gemini Chatbot Ready! Type 'exit' to quit.\n")
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            print("Chatbot session ended.")
            break
        response = qa_chain.invoke({"question": query})
        print("\nBot:", response["result"], "\n")
