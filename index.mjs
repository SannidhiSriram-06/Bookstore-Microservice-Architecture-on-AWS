export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    // API Gateway REST API uses 'resource' field
    const resource = event.resource || '/';
    const method = event.httpMethod || 'GET';
    
    console.log('Resource:', resource, 'Method:', method);
    
    // In-memory storage for demo (would use MongoDB in production)
    const books = [
        { id: '1', title: 'Cloud Computing Basics', author: 'AWS Expert', price: 29.99 },
        { id: '2', title: 'MongoDB for Beginners', author: 'DB Master', price: 24.99 },
        { id: '3', title: 'AWS Lambda Deep Dive', author: 'Serverless Pro', price: 34.99 }
    ];
    
    let response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: ''
    };
    
    try {
        // Handle based on resource and method
        if (resource === '/books' && method === 'GET') {
            // GET /books - List all books
            response.body = JSON.stringify({ 
                success: true, 
                count: books.length,
                data: books 
            });
        }
        else if (resource === '/books' && method === 'POST') {
            // POST /books - Add a book
            const newBook = JSON.parse(event.body || '{}');
            newBook.id = String(books.length + 1);
            books.push(newBook);
            response.statusCode = 201;
            response.body = JSON.stringify({ 
                success: true, 
                message: 'Book added successfully',
                data: newBook 
            });
        }
        else if (resource === '/books' && method === 'OPTIONS') {
            // Handle CORS preflight
            response.statusCode = 200;
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
            response.body = JSON.stringify({ success: true });
        }
        else {
            // Catch-all
            response.body = JSON.stringify({ 
                success: true, 
                message: 'Bookstore API is running',
                timestamp: new Date().toISOString(),
                resource: resource,
                method: method,
                note: 'Try GET /books or POST /books'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        response.statusCode = 500;
        response.body = JSON.stringify({ 
            success: false, 
            error: error.message,
            stack: error.stack 
        });
    }
    
    return response;
};
