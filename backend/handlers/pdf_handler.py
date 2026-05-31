import fitz  # PyMuPDF

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = []
    for page in doc:
        pages.append(page.get_text())
    doc.close()
    text = "\n\n".join(pages).strip()
    if not text:
        raise ValueError("PDF has no extractable text (may be scanned/image-only)")
    return text
