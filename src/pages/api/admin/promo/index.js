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

        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { title, num, images } = req.body
        if (!title || !num || !images[0]) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const product = {
            title: title,
            num: num,
            images: images,
            created_at: new Date(),
            updated_at: new Date(),
        }

        const result = await db.collection('promo').insertOne(product)
        const promo = await db.collection('promo').find().toArray()
        res.status(201).json({result, promo})
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def