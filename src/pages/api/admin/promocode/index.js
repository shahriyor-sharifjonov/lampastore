import clientPromise from '@/lib/mongodb'

import { getServerSession } from "next-auth/next"
import { images } from '../../../../../next.config'
import { authOptions } from "../../auth/[...nextauth]"

const def = async (req, res) => {
    switch(req.method){
        case 'POST':
            await createPromocode(req, res)
            break
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const createPromocode = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const client = await clientPromise
        const db = client.db()

        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { title, type, promoCode, otPrice, discount, startDate, endDate } = req.body
        if (!title && !type && !promoCode && !otPrice && !discount && !startDate && !endDate) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const promocodeDate = {
            title: title,
            type: type,
            promoCode: promoCode,
            otPrice: otPrice,
            discount: discount,
            startDate: startDate,
            endDate: endDate,
            created_at: new Date(),
            updated_at: new Date(),
        }

        const result = await db.collection('promocode').insertOne(promocodeDate)
        const promocode = await db.collection('promocode').find().toArray()
        res.status(201).json({result, promocode})
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def