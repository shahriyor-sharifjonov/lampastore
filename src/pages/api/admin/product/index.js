import clientPromise from '@/lib/mongodb'

import { getServerSession } from "next-auth/next"
import { images } from '../../../../../next.config'
import { authOptions } from "../../auth/[...nextauth]"

const def = async (req, res) => {
    switch(req.method){
        case 'POST':
            await createProduct(req, res)
            break
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const createProduct = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const client = await clientPromise
        const db = client.db()

        if (!session || session.customUser.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { title, description, category, subcategory, fields, images, price, vip } = req.body
        if (!title || !category || !fields || !price) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const product = {
            title: title,
            description: description,
            price: price,
            category: category,
            subcategory: subcategory,
            images: images,
            fields: fields,
            vip: vip,
            created_at: new Date(),
        }

        const result = await db.collection('products').insertOne(product)
        const products = await db.collection('products').find().toArray()
        res.status(201).json({result, products})
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def