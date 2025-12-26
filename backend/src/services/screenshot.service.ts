import prisma from '../utils/prisma';
import fs from 'fs';
import path from 'path';

/**
 * Create a new screenshot for a trade
 */
export async function createScreenshot(
  userId: string,
  tradeId: string,
  file: Express.Multer.File
) {
  // Verify trade ownership
  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
  });

  if (!trade) {
    return null;
  }

  // Create screenshot record
  const screenshot = await prisma.screenshot.create({
    data: {
      tradeId,
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });

  return screenshot;
}

/**
 * Delete a screenshot
 */
export async function deleteScreenshot(userId: string, screenshotId: string) {
  // Find screenshot and verify ownership through trade
  const screenshot = await prisma.screenshot.findUnique({
    where: {
      id: screenshotId,
    },
    include: {
      trade: true,
    },
  });

  if (!screenshot || screenshot.trade.userId !== userId) {
    return null;
  }

  // Delete file from filesystem
  const filePath = path.join(__dirname, '../../uploads', screenshot.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Delete screenshot record
  await prisma.screenshot.delete({
    where: {
      id: screenshotId,
    },
  });

  return screenshot;
}
