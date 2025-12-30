from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, spotify
import uvicorn
import os
import asyncio
from pathlib import Path

from app.db.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Super Shuffler API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://localhost:4200'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
async def root():
    return {'message': 'Hello World'}


app.include_router(auth.router)
app.include_router(spotify.router)

if __name__ == '__main__':
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    port = int(os.environ.get('PORT', 8000))
    print(f'Starting FastAPI on port {port} with HTTPS...', flush=True)

    if os.path.exists('/app/ssl-certificates'):
        ssl_keyfile = '/app/ssl-certificates/localhost+2-key.pem'
        ssl_certfile = '/app/ssl-certificates/localhost+2.pem'
    else:
        base_dir = Path(__file__).resolve().parent.parent.parent
        ssl_keyfile = os.path.join(base_dir, 'ssl-certificates', 'localhost+2-key.pem')
        ssl_certfile = os.path.join(base_dir, 'ssl-certificates', 'localhost+2.pem')

    print(f'SSL Keyfile: {ssl_keyfile}', flush=True)
    print(f'SSL Certfile: {ssl_certfile}', flush=True)

    uvicorn.run(
        app,
        host='0.0.0.0',
        port=port,
        ssl_keyfile=ssl_keyfile,
        ssl_certfile=ssl_certfile,
        log_level='info',
    )
