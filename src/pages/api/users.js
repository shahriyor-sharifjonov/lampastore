import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
    switch(req.method){
        case 'GET':
            await getUsers(req, res)
            break;
    }
}

const getUsers = async (req, res) => {
    try {
        const client = await clientPromise
        const db = client.db()

        const users = await db.collection('customUser').find().toArray()
        res.status(200).json(users)
    }
    catch (err) {
        return res.status(500).json({err: err.message})
    }
}

export default def