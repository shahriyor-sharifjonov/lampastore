import clientPromise from '@/lib/mongodb'

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"


const def = async (req, res) => {
    switch(req.method){
        case 'DELETE':
            await deleteProduct(req, res)
            break
        case 'PUT':
            await updateCategory(req, res)
            break 
        default:
            res.setHeader('Allow', ['DELETE', 'PUT']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const deleteProduct = async (req, res) => {
    const { query: { id } } = req;
    const client = await clientPromise;
    const db = client.db();
    
    const session = await getServerSession(req, res, authOptions);
  
    if (!session || session.customUser.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
  
    try {
        const deleteCategoryRecursive = async (categoryId) => {
            await db.collection("categories").deleteOne({ _id: new ObjectId(categoryId) })
        };
        
        await db.collection("products").deleteMany({ category: { $in: [id] } })

        await deleteCategoryRecursive(id)

        const result = await db.collection("categories").find().toArray()
    
        res.status(200).json(result)
    } catch (error) {
        console.error("Error occurred:", error)
        res.status(500).json({ error: error })
    }
}
  

const updateCategory = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions);
        const client = await clientPromise
        const db = client.db()

        if (!session || session.customUser.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { query: { id } } = req
        const { name, slug, subcategories } = req.body

        if (!name || !slug) {
            res.status(400).json({ message: 'Add all fields' })
            return
        }

        const result = await db.collection('categories').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: name,
                    slug: slug,
                    subcategories: subcategories,
                }
            }
        )

        if (result.modifiedCount === 1) {
            const updatedCategory = await db.collection('categories').findOne({ _id: new ObjectId(id) })
            const result = await db.collection("categories").find().toArray()
        
            res.status(200).json(result)
        } else {
            res.status(404).json({ message: 'Category not found or not updated' })
        }
    } catch (error) {
        console.error('Error occurred:', error)
        res.status(500).json({ error: error })
    }
}


export default def