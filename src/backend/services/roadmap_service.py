from groq import Groq
import os
from dotenv import load_dotenv
import json

load_dotenv()

def generate_roadmap(goal: str) -> dict:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                    Generate a detailed learning roadmap for '{goal}' in this exact JSON format:
                    {{
                        "roadmap": [
                            {{
                                "step": "Category Name",
                                "substeps": [
                                    {{
                                        "title": "Step Title",
                                        "description": "What to learn",
                                        "icon": "theory|practice|resource",
                                        "resources": [
                                            {{"name": "Resource Name", "link": "URL"}}
                                        ]
                                    }}
                                ]
                            }}
                        ]
                    }}
                    Return ONLY valid JSON.
                    """
                }
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"Error generating roadmap: {str(e)}")
        raise