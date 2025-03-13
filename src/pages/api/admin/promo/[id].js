import clientPromise from '@/lib/mongodb'

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"


const def = async (req, res) => {
    switch(req.method){
        case 'DELETE':
            await deletePromo(req, res)
            break
        default:
            res.setHeader('Allow', ['DELETE', 'PUT']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const deletePromo = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const client = await clientPromise;
    const db = client.db();

    if (!session || session.user.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const { query: { id } } = req;

    try {
        await db.collection("promo").deleteOne({ _id: new ObjectId(id) })

        const result = await db.collection("promo").find().toArray()
    
        res.status(200).json(result)
    } catch (error) {
        console.error("Error occurred:", error)
        res.status(500).json({ error: error })
    }
}

export default def