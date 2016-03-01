class Request implements IRequest
{
    public Message: string = "";

    public static GetRequest(request: IRequest): Request
    {
        var buffer = new Request();
        buffer.Message = request.Message;

        return buffer;
    }
}