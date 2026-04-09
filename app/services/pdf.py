import fitz


def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    if doc.page_count == 0:
        raise ValueError("PDF has no pages.")

    pages = []
    for page in doc:
        text = page.get_text("text")
        if text.strip():
            pages.append(text.strip())

    doc.close()

    if not pages:
        raise ValueError("PDF contains no extractable text. It may be a scanned image-only PDF.")

    return "\n\n".join(pages)