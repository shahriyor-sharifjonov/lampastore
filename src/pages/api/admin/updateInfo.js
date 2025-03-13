import clientPromise from '@/lib/mongodb'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

const def = async (req, res) => {
    switch(req.method){
        case 'POST':
            await updateInfo(req, res)
            break
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const updateInfo = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const client = await clientPromise
        const db = client.db()

        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { tel1, tel2, email } = req.body
        if (!tel1 || !email) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const filter = {};

        const updateDoc = {
            $set: {
                tel1: tel1,
                tel2: tel2,
                email: email,
                updated_at: new Date()
            },
            $setOnInsert: {
                created_at: new Date()
            }
        };

        const options = {
            upsert: true
        };

        const result = await db.collection('info').updateOne(filter, updateDoc, options);

        res.status(201).json({ result });
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

export default def