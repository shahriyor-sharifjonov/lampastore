import clientPromise from '@/lib/mongodb'

const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      await getProducts(req, res)
      break
    default:
      res.status(405).json({ message: 'Method Not Allowed' })
  }
}

const getProducts = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const { page = 1, limit = 10, category } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // 🧠 Фильтр по категории
    const filter = {}
    if (category) {
      filter.category = category // category — строка, как в базе
    }

    const products = await db
      .collection('products')
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray()

    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export default handler
