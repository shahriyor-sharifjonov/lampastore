import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const client = await clientPromise
    const db = client.db()
    const { id } = req.query
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) })

    if (!product) return res.status(404).json({ error: 'Not found' })

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}