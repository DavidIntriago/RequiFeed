import { get } from '@/hooks/SessionUtil';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
enum Role {
  DOCENTE = "DOCENTE",
  ANALISTA = "ANALISTA",
  LIDER = "LIDER",
  OBSERVADOR = "OBSERVADOR",
}

const restrictedRoutes: Record<Role, string[]> = {
  [Role.DOCENTE]: [ "/docente", "/docente/dashboard", "/docente/profile", "/docente/profile/edit/:id", "/docente/projects", "/docente/projects/edit/:id" ], // Rutas restringidas para ADMIN
  [Role.ANALISTA]: [ "/estudiante/dashboard","/estudiante/profile", "/estudiante/profile/edit/:id", "/estudiante/projects",
    "/estudiante/project/create", "/estudiante/project/edit/:id" 
   ],          // Rutas restringidas para USER
  [Role.LIDER]: ["/estudiante/dashboard","/estudiante/profile", "/estudiante/profile/edit/:id", "/estudiante/projects",
    "/estudiante/project/create", "/estudiante/project/edit/:id"
    // , "/trader/stores/catalogs/products/:id", "/trader/stores/catalogs/products/stocks/:id", "/trader/stores/catalogs/product/create"
    // ,"/trader/stores/catalogs/createProduct/:id", "/trader/stores/catalogs/products/stocks/createStock/:id", "/trader/suscriptions", "/trader/suscriptions/:id"
    // ,"/trader/stores/catalogs/createCatalog/:id",
  ],
  [Role.OBSERVADOR] : [ "/observador", "/observador/dashboard", "/observador/profile", "/observador/profile/edit/:id"]
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Obtener el token de las cookies
  const token = request.cookies.get("token")?.value;
  if (!token) {
    console.log(request.nextUrl.pathname);
    if (request.nextUrl.pathname == '/authentication/signin' || request.nextUrl.pathname == '/authentication/signup'  || request.nextUrl.pathname == '/authentication/password-reset'){
      console.log('dentro de products')
      return NextResponse.next();
    }
    // if (/^\/products\/[0-9a-fA-F-]{36}$/.test(request.nextUrl.pathname)) {
    //   return NextResponse.next();
    // }
    
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  const rawRole = request.cookies.get("rol")?.value;
  console.log("ROLLL");
  console.log(rawRole);
  
  let userRole: Role | undefined;
  if (rawRole) {
    try {
      const parsedRole = JSON.parse(rawRole);
      userRole = Array.isArray(parsedRole) ? (parsedRole[0] as Role) : (parsedRole as Role);
    } catch {
      userRole = rawRole.replace(/[\[\]"]/g, "") as Role;
    }
  }

  if (!userRole || !Object.values(Role).includes(userRole)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const currentPath = request.nextUrl.pathname;
  const allowedRoutes = restrictedRoutes[userRole] || [];

  // Validar si el usuario tiene acceso a la ruta actual
  const hasAccess = allowedRoutes.some((routePattern) => {
    const regex = new RegExp(
      "^" +
        routePattern
          .replace(/:[^/]+/g, "[^/]+") // Maneja rutas como "/trader/stores/:id"
          .replace(/\*/g, ".*") + // Maneja rutas como "/admin/:path*"
        "$"
    );
    return regex.test(currentPath);
  });

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Continuar si todo es válido
  return NextResponse.next();
}
 
// Configuración del matcher
export const config = {
  matcher: ["/docente/:path*",
     "/estudiante/:path*",
      "/observador/:path*"],
};
