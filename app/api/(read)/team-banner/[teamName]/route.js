import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET (req, {params}) {
  const teamBanner = params.teamName
    // Construct the path to the image file
    const imagePath = path.join(process.cwd(), 'public', 'images', 'team-banners', `${teamBanner}.png`);

    try {
        // Read the image file asynchronously
        const imageData = fs.readFileSync(imagePath);

        // Send the image as the response
        return new NextResponse(imageData, {
          'method': "GET",
          "status": 200,
            'Content-Type': 'image/png' // Set the content type to image/png
        });
    } catch (error) {
        // If the image file cannot be found, return a 404 response
        return new NextResponse({ error: 'Image not found' }, {
          'method': "GET",
          "status": 500,
        }
        );
    }
  
};