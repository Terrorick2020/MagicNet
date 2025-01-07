export const isWorkPaths = {
    '/': {
        get: {
            summary: 'Проверка работоспособности api!',
            description: 'Этот ендпоинт служит для проверки работоспособности api!',
            tags: ['Hello'],
            responses: {
                '200': {
                    description: 'Приветственное сообщение!',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'success'
                                    }
                                }
                            },
                            examples: {
                                'application/json': {
                                    value: {
                                        message: 'success'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}