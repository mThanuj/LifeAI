import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import (
    TextLoader, PDFPlumberLoader, UnstructuredFileLoader
)
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from pathlib import Path

def ask_question_with_file(file_path, question):
    os.environ["GOOGLE_API_KEY"] = "your_google_api_key_here"

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.7)
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

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

    ext = Path(file_path).suffix.lower()
    loader_cls = {
        ".txt": TextLoader,
        ".pdf": PDFPlumberLoader,
        ".csv": UnstructuredFileLoader,
        ".docx": UnstructuredFileLoader,
        ".pptx": UnstructuredFileLoader,
        ".html": UnstructuredFileLoader,
    }.get(ext)

    if not loader_cls:
        raise ValueError(f"Unsupported file format: {ext}")

    loader = loader_cls(file_path)
    documents = loader.load()

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    db = Chroma.from_documents(docs, embedding)
    retriever = db.as_retriever()

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=False,
        input_key="question"
    )

    result = qa_chain.invoke({"question": question})
    return result["result"]
