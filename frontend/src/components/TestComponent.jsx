import Header from "./Header";
function TestComponent() {
    return (
        <div className="w-screen min-h-screen bg-white">
            <Header pageNum={3} />
        </div>
    );
}

export default TestComponent;
