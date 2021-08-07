var models = require('../models/models');

describe('Get Tests', () => {
    test('getMaker',async () => {
        return models.getMakerById(1).then(data => {
            expect(data).toBe({
                "id": 1,
                "name": "hungerworkstudio",
                "display_name": "Hungerwork Studio",
                "instagram": "hungerworkstudio"
            })
        });
    });
});