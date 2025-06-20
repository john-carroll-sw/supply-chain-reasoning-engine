from dotenv import load_dotenv
import openai
from pydantic import BaseModel
from typing import List
import os
import json

load_dotenv()
API_HOST = os.getenv("API_HOST")

client = None
DEPLOYMENT_NAME = None

if API_HOST == "azure":
    client = openai.AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    )
    DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
elif API_HOST == "openai":
    client = openai.OpenAI(api_key=os.getenv("OPENAI_KEY"))
    DEPLOYMENT_NAME = os.getenv("OPENAI_MODEL")
elif API_HOST == "ollama":
    client = openai.AsyncOpenAI(
        base_url="http://localhost:11434/v1",
        api_key="nokeyneeded",
    )
    DEPLOYMENT_NAME = os.getenv("OLLAMA_MODEL")

if client is None or DEPLOYMENT_NAME is None:
    raise ValueError("Invalid API_HOST or missing environment variables")

class CoffeeMenuItem(BaseModel):
    category: str
    item: str
    description: str
    price: str = None

class CoffeeMenu(BaseModel):
    items: List[CoffeeMenuItem]

def print_parsed_menu(parsed_menu):
    # Print the parsed menu in a formatted way
    if parsed_menu:
        for item in parsed_menu.items:
            print(f"Category: {item.category}")
            print(f"Item: {item.item}")
            print(f"Description: {item.description}")
            print(f"Price: {item.price}")
            print()  # Add a blank line between items

def parse_menu_with_gpt4o(raw_text, model_deployment_name):
    """Parse the raw text into structured JSON using GPT-4o."""
    prompt = f"""
    You are a menu parser. Convert the following raw text from a coffee menu into structured JSON with the fields:
    - category
    - item
    - description
    - price (if available)

    Here is the coffee menu text:
    ---
    {raw_text}
    ---
    """
    try:
        response = client.beta.chat.completions.parse(
            model=model_deployment_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            response_format=CoffeeMenu
        )

        parsed_output = response.choices[0].message.parsed
        return parsed_output

    except openai.ContentFilterFinishReasonError as e:
        print(f"Content filter error: {e}")
        print(f"Problematic prompt: {prompt}")
        return None

# Example usage
sample_raw_text = """
Espresso Drinks
- Espresso: A strong coffee brewed by forcing hot water under pressure through finely ground coffee beans. $2.99
- Cappuccino: Espresso with steamed milk and a layer of foam. $3.99

Cold Brews
- Cold Brew: Coffee brewed cold for a smooth, rich flavor. $4.99
- Nitro Cold Brew: Cold brew infused with nitrogen for a creamy texture. $5.99
"""

# Ensure the output directory exists
os.makedirs('output', exist_ok=True)

# Print the Pydantic classes
print("Pydantic classes used in the script:")

print("\nclass CoffeeMenuItem(BaseModel):")
print("    category: str")
print("    item: str")
print("    description: str")
print("    price: str = None")

print("\nclass CoffeeMenu(BaseModel):")
print("    items: List[CoffeeMenuItem]")

print("\nParsing the following raw text:")
print(sample_raw_text)

parsed_menu = parse_menu_with_gpt4o(sample_raw_text, DEPLOYMENT_NAME)

print("\nParsed menu in structured JSON based on the pydantic classes:")
print_parsed_menu(parsed_menu)

# Save the parsed menu to a JSON file
if parsed_menu:
    with open('output/structured_outputs_parsed_menu.json', 'w') as file:
        json.dump(parsed_menu.dict(), file, indent=4)
