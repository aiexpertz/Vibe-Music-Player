-- 1. has_role: switch from SECURITY DEFINER to SECURITY INVOKER.
-- It only reads the caller's own row in user_roles, which the existing
-- "Users can view their own roles" policy already allows.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$function$;

GRANT SELECT ON public.user_roles TO authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 2. Trigger-only functions must not be callable through the API.
REVOKE ALL ON FUNCTION public.handle_new_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 3. Replace the always-true contact message INSERT policy with a validated one.
CREATE OR REPLACE FUNCTION public.is_valid_contact_message(_name text, _email text, _message text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT length(btrim(_name)) BETWEEN 1 AND 100
     AND length(_email) BETWEEN 3 AND 255
     AND _email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     AND length(btrim(_message)) BETWEEN 1 AND 5000
$function$;

REVOKE ALL ON FUNCTION public.is_valid_contact_message(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_valid_contact_message(text, text, text) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a valid contact message"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  is_read = false
  AND public.is_valid_contact_message(name, email, message)
);