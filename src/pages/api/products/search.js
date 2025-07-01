import clientPromise from '@/lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const { q = '' } = req.query
    if (!q || q.trim().length < 2) {
      return res.status(200).json([]) // слишком короткий запрос — ничего не ищем
    }

    const search = q.toLowerCase()

    const products = await db
      .collection('products')
      .find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { num: { $regex: search, $options: 'i' } },
        ],
      })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray()

    res.status(200).json(products)
  } catch (error) {
    console.error('Search API error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
