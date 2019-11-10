exports.handler = async (event) => {
    const reading = Math.floor(Math.random() * 101);
    const response = {
        statusCode: 200,
        body: reading
    };
    return response;
};