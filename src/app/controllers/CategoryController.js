const { v4 } = require('uuid');
const CategoryService = require('../services/CategoryService');

class CategoryController {

    async index(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'login required' });
        }

        CategoryService.getCategories(userId)
            .then(resp => {
                if (resp.length === 0) {
                    return res.status(404).json({ 'message': 'categories not found' });
                }
                const categories = resp.map(({ category_id, name, color }) => {
                    return { category_id: category_id, name: name, color: color }
                });
                return res.status(200).json({ 'data': categories });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() })
            })
    }

    async store(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'login required' });
        }
        const { name, color } = req.body;
        if (!name) {
            return res.status(400).json({ 'message': 'category name is required' });
        }

        if (!color) {
            return res.status(400).json({ 'message': 'category color is required' });
        }

        const newCategory = {
            name,
            color,
            user_id: userId,
            category_id: v4()
        }
        CategoryService.newCategory(newCategory)
            .then(() => {
                return res.status(201).json({ 'message': 'category created successfully' });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() })
            });
    }

    async delete(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 'message': 'required login' });
        }

        const categoryId = req.path.substring(12);
        if(!categoryId) {
            return res.status(400).json({'message': 'category id is required '});
        }
        
        CategoryService.deleteCategory(categoryId, userId)
        .then(resp => {
            if (resp.length === 0) {
                return res.status(404).json({ 'message': 'category not found' });
            }
            return res.status(200).json({ 'message': 'category deleted successfully' });
        })
        .catch(err => {
            return res.status(500).json({ 'message': err.toString() })
        });
    }
}

module.exports = new CategoryController();