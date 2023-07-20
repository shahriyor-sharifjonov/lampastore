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
        const db = client.db('test')

        if (!session || session.customUser.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { title, slug, subcategories, fields } = req.body
        if (!title || !slug) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const category = {
            title: title,
            slug: slug,
            subcategories: subcategories,
            fields: fields,
        }

        const result = await db.collection('categories').insertOne(category)
        res.status(201).json(result)
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def