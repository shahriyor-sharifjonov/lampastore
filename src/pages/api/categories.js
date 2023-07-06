import categories from '@/db/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!categories || categories.length === 0) {
    return res.status(404).json({ message: 'No categories found' });
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = categories;
  res.status(200).json(response);
}