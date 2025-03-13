import clientPromise from '@/lib/mongodb'

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"


const def = async (req, res) => {
    switch(req.method){
        case 'DELETE':
            await deleteUser(req, res)
            break
        case 'PUT':
            await updateUser(req, res)
            break
        default:
            res.setHeader('Allow', ['DELETE', 'PUT']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const deleteUser = async (req, res) => {
    const { query: { id } } = req;
    const client = await clientPromise;
    const db = client.db();
    const session = await getServerSession(req, res, authOptions);
  
    if (!session || session.user.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const customUser = await db.collection("customUser").find({ _id: new ObjectId(id) }).toArray()

        if(customUser.length !== 0){
            const user = await db.collection("users").find({ _id: new ObjectId(customUser[0].userId) }).toArray()
            const session = await db.collection("sessions").find({ userId: new ObjectId(customUser[0].userId) }).toArray()
            const account = await db.collection("accounts").find({ userId: new ObjectId(customUser[0].userId) }).toArray()

            await db.collection("customUser").deleteMany({ _id: new ObjectId(id) })
            await db.collection("users").deleteMany({ _id: new ObjectId(customUser[0].userId) })
            await db.collection("sessions").deleteMany({ userId: new ObjectId(customUser[0].userId) })
            await db.collection("accounts").deleteMany({ userId: new ObjectId(customUser[0].userId) })

            res.status(200).json({ customUser, user, session, account })
        }else{
            res.status(404).json({ error: "User not found" })
        }
    } catch (error) {
        console.error("Error occurred:", error)
        res.status(500).json({ error: error })
    }
}

const updateUser = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions);
        const client = await clientPromise
        const db = client.db()
    
        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }
    
        const { query: { id } } = req
        const { role } = req.body
    
        if (!role) {
            res.status(400).json({ message: 'Please provide all fields' })
            return
        }
    
        const result = await db.collection('customUser').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    role: role
                }
            }
        )
    
        if (result.modifiedCount === 1) {
            const updatedUser = await db.collection('customUser').findOne({ _id: new ObjectId(id) })
            res.status(200).json({updatedUser})
        } else {
            res.status(404).json({ message: 'User not found or not updated' })
        }
    } catch (error) {
        console.error('Error occurred:', error)
        res.status(500).json({ error: error })
    }
}


export default def