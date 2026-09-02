'use client'

import { usePathname } from 'next/navigation'
import { NAVLINKS } from '@/constants/nav-links'

export const Breadcrumb = () => {
    const pathname = usePathname()
    const currentPage = NAVLINKS.find((link) => link.href === pathname)
    const pageTitle = currentPage?.name ?? 'Home'

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