import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Simple PDF text extraction
    const text = buffer.toString('utf-8');

    // Try to extract readable text from PDF
    let extractedText = '';

    // Look for text between common PDF text markers
    const textMatches = text.match(/\((.*?)\)/g);
    if (textMatches) {
      extractedText = textMatches
        .map(match => match.slice(1, -1))
        .filter(text => text.length > 2)
        .join('\n');
    }

    // If no text found with parentheses method, try stream objects
    if (!extractedText) {
      const streamMatches = text.match(/stream\s+([\s\S]*?)\s+endstream/g);
      if (streamMatches) {
        extractedText = streamMatches
          .map(match => {
            const content = match.replace(/stream\s+|\s+endstream/g, '');
            return content.replace(/[^\x20-\x7E\n]/g, ' ');
          })
          .join('\n');
      }
    }

    // Fallback: just get any readable text
    if (!extractedText) {
      extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ');
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
}
