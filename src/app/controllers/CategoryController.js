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
                const categories = resp.map(({ name, color }) => {
                    return { name, color }
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
            user_id: userId
        }
        CategoryService.newCategory(newCategory)
            .then(() => {
                return res.status(201).json({ 'message': 'category created successfully' });
            })
            .catch(err => {
                return res.status(500).json({ 'message': err.toString() })
            })
    }
}

module.exports = new CategoryController();