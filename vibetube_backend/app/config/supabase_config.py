from supabase import create_client, Client
from app.constants.supabase_constants import SUPABASE_KEY, SUPABASE_URL

supabase: Client = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)
