from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import re
from scholarly import scholarly

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

class AuthorRequest(BaseModel):
    author_name: str

class AuthorProfile(BaseModel):
    name: str
    affiliation: Optional[str]
    interests: Optional[List[str]]
    citedby: Optional[int]
    hindex: Optional[int]
    i10index: Optional[int]

class Publication(BaseModel):
    title: str
    authors: str
    journal: Optional[str]
    year: Optional[int]
    abstract: Optional[str]
    url: Optional[str]
    nirma_co_authors: int

def get_author_profile(author_name):
    try:
        search_query = scholarly.search_author(author_name)
        author = next(search_query, None)
        if not author:
            return None
        profile = scholarly.fill(author)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching author profile: {str(e)}")

def filter_publications_by_year(publications, year):
    return [pub for pub in publications if int(pub.get('bib', {}).get('pub_year', 0)) == year]

def count_co_authors_from_nirma(publication):
    nirma_count = 0
    nirma_regex = re.compile(r"nirma university|institute of technology, nirma university", re.IGNORECASE)
    
    for author in publication.get('author', []):
        affiliation = author.get('affiliation', '')
        if nirma_regex.search(affiliation):
            nirma_count += 1
    return nirma_count

def format_publication(publication):
    title = publication.get('bib', {}).get('title', 'N/A')
    authors = ', '.join(publication.get('bib', {}).get('author', []))
    journal = publication.get('bib', {}).get('journal', 'N/A')
    year = int(publication.get('bib', {}).get('pub_year', 0)) if publication.get('bib', {}).get('pub_year') else None
    abstract = publication.get('bib', {}).get('abstract', 'N/A')
    url = publication.get('pub_url', 'N/A')
    nirma_co_authors = count_co_authors_from_nirma(publication)

    return Publication(
        title=title,
        authors=authors,
        journal=journal,
        year=year,
        abstract=abstract,
        url=url,
        nirma_co_authors=nirma_co_authors
    )

@app.post("/author/profile", response_model=AuthorProfile)
async def get_author(author_request: AuthorRequest):
    profile = get_author_profile(author_request.author_name)
    if not profile:
        raise HTTPException(status_code=404, detail=f"No author found with the name {author_request.author_name}")
    
    return AuthorProfile(
        name=profile.get('name', 'N/A'),
        affiliation=profile.get('affiliation', 'N/A'),
        interests=profile.get('interests', []),
        citedby=profile.get('citedby'),
        hindex=profile.get('hindex'),
        i10index=profile.get('i10index')
    )

@app.post("/author/publications", response_model=List[Publication])
async def get_publications(author_request: AuthorRequest, year: Optional[int] = None):
    profile = get_author_profile(author_request.author_name)
    if not profile:
        raise HTTPException(status_code=404, detail=f"No author found with the name {author_request.author_name}")
    
    publications = profile.get('publications', [])
    if year:
        publications = filter_publications_by_year(publications, year)

    formatted_publications = [format_publication(pub) for pub in publications]
    return formatted_publications

