import clientPromise from '@/lib/mongodb'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

const def = async (req, res) => {
    switch(req.method){
        case 'POST':
            await createCategory(req, res)
            break
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const createCategory = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const client = await clientPromise
        const db = client.db()

        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { name, slug, subcategories } = req.body
        if (!name || !slug) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        if (await db.collection('categories').findOne({slug: slug})){
            res.status(400).json({ message: 'category with this link already exists' })
            return
        }

        const category = {
            name: name,
            slug: slug,
            subcategories: subcategories,
        }

        const result = await db.collection('categories').insertOne(category)
        const categories = await db.collection('categories').find().toArray()
        res.status(201).json(categories)
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def