import categories from '@/db/categories';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cat } = req.query;
  
  const response = categories.find(category => category.link === cat);

  if (!response) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json(response);
}