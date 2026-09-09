// 'use client'

// import { usePathname } from 'next/navigation'
// import { NAVLINKS } from '@/constants/nav-links'

// export const Breadcrumb = () => {
//     const pathname = usePathname()
//     const currentPage = NAVLINKS.find((link) => link.href === pathname)
//     const pageTitle = currentPage?.name ?? 'Home'

//     return (
//         <div className="ayur-bread-section">
//             <div className="ayur-breadcrumb-wrapper">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12 col-md-12 col-sm-12">
//                             <div className="ayur-bread-content">
//                                 <h2>{pageTitle}</h2>
//                                 <div className="ayur-bread-list">
//                                     <span>
//                                         <a href="/">Home</a>
//                                     </span>
//                                     <span className="ayur-active-page">{pageTitle}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }




































'use client'

import { usePathname } from 'next/navigation'
import { NAVLINKS } from '@/constants/nav-links'

// Pages that are reachable (cart icon, account icon, etc.) but are
// deliberately NOT in the main NAVLINKS nav. Without an entry here,
// the lookup below falls through and every one of these pages shows
// "Home" in the breadcrumb.
const EXTRA_PAGE_TITLES: Record<string, string> = {
    '/cart': 'Cart',
    '/orders': 'My Orders',
    '/login': 'Login',
    '/register': 'Register',
    '/forgot-password': 'Forgot Password',
    '/admin/login': 'Admin Login',
}

// Last-resort fallback for any route that ends up here without an
// explicit entry above (e.g. a page added later and forgotten here) —
// turns "/order-confirmation" into "Order Confirmation" instead of
// silently mislabeling the page as "Home".
function titleFromPathname(pathname: string) {
    const lastSegment = pathname.split('/').filter(Boolean).pop()
    if (!lastSegment) return 'Home'
    return lastSegment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const Breadcrumb = () => {
    const pathname = usePathname() ?? '/'

    const pageTitle =
        pathname === '/'
            ? 'Home'
            : NAVLINKS.find((link) => link.href === pathname)?.name ??
              EXTRA_PAGE_TITLES[pathname] ??
              titleFromPathname(pathname)

    return (
        <div className="ayur-bread-section">
            <div className="ayur-breadcrumb-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="ayur-bread-content">
                                <h2>{pageTitle}</h2>
                                <div className="ayur-bread-list">
                                    <span>
                                        <a href="/">Home</a>
                                    </span>
                                    <span className="ayur-active-page">{pageTitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}