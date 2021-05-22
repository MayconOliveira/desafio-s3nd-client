

export default function Template({props,Component}) {
    return(
        <div className="app">
            <div className="container">
                <header className="app-header">
                    <div className="app-logo">
                        <img src="https://s3nd.com.br/institucional/images/s3nd/s3nd-logo.png"/>
                    </div>
                </header>
            </div>
            <Component/>
        </div>
    );
};