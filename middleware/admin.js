// middleware/admin.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  // If user is not logged in, redirect to login
  if (!user.value) {
    return navigateTo('/admin/login')
  }
  
  // Check if user is an admin
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.value.id)
    .single()
  
  if (error || !data) {
    // Not an admin, sign them out and redirect
    await supabase.auth.signOut()
    return navigateTo('/admin/login')
  }
})