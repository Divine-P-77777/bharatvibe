import React, { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import WebViewer from '@pdftron/pdfjs-express';

type LinkedinPDFCarouselProps = {
    url: string;
    downloadName?: string;
};

const ICON_ARROW = (dir: 'left' | 'right') => (
    <span className="w-10 h-10 flex items-center justify-center bg-black/60 rounded-full shadow-lg text-white text-2xl cursor-pointer select-none">
        {dir === 'left' ? '\u2039' : '\u203A'}
    </span>
);
const ICON_EXPAND = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/>
        <rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/>
    </svg>
);
const ICON_DOWNLOAD = (
    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);
const ICON_CLOSE = (
    <svg width="30" height="30" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.2" fill="none">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const CarouselCore: React.FC<{
    url: string;
    downloadName?: string;
    onExpand?: () => void;
    showExpand?: boolean;
    showDownload?: boolean;
    overlay?: boolean;
    onCloseOverlay?: () => void;
}> = ({
    url, downloadName, onExpand, showExpand, showDownload, overlay = false, onCloseOverlay
}) => {
    const viewer = useRef<HTMLDivElement>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const instanceRef = useRef<any>(null);
    const dragStartX = useRef<number | null>(null);

    // --- Helper: Setup and cleanup WebViewer instance ---
    const setupWebViewer = useCallback(() => {
        if (instanceRef.current?.UI) instanceRef.current.UI.dispose?.();
        instanceRef.current = null;
        if (viewer.current) while (viewer.current.firstChild) viewer.current.removeChild(viewer.current.firstChild);

        WebViewer(
            {
                path: '/webviewer',
                initialDoc: url,
                licenseKey: undefined,
                fullAPI: false,
                enableFilePicker: false,
                disabledElements: [
                    'header','toolsHeader','toolsOverlay','viewControlsButton','searchButton','panToolButton','menuOverlay',
                    'leftPanelButton','rightPanelButton','thumbnailsPanelButton','outlinesPanelButton','notesPanelButton',
                    'rubberStampToolGroupButton','fileAttachmentToolGroupButton','shapeToolGroupButton','selectToolButton',
                    'printButton','downloadButton','openFileButton','shareButton','toolbarGroup-Annotate','toolbarGroup-Edit',
                    'toolbarGroup-Shapes','toolbarGroup-Insert','toolbarGroup-Forms'
                ],
                showToolbarControl: false,
                showSidePanelButton: false,
            },
            viewer.current
        ).then((instance: any) => {
            instanceRef.current = instance;
            instance.UI.disableElements([
                'header','toolsHeader','toolsOverlay','viewControlsButton','searchButton','menuOverlay',
                'leftPanelButton','rightPanelButton','thumbnailsPanelButton','outlinesPanelButton','notesPanelButton',
                'rubberStampToolGroupButton','fileAttachmentToolGroupButton','shapeToolGroupButton','selectToolButton',
                'printButton','downloadButton','openFileButton','shareButton','toolbarGroup-Annotate','toolbarGroup-Edit',
                'toolbarGroup-Shapes','toolbarGroup-Insert','toolbarGroup-Forms'
            ]);
            instance.UI.setToolbarGroup('');
            instance.UI.setTheme('dark');
            instance.Core.documentViewer.addEventListener('documentLoaded', () => {
                const doc = instance.Core.documentViewer.getDocument();
                setTotalPages(doc.getPageCount());
                setCurrentPage(1);
                instance.UI.setZoomLevel('PageWidth');
            });
            instance.Core.documentViewer.addEventListener('pageNumberUpdated', () => {
                setCurrentPage(instance.Core.documentViewer.getCurrentPage());
            });
            viewer.current?.addEventListener('contextmenu', e => e.preventDefault());
        });
    }, [url]);

    useEffect(() => {
        setupWebViewer();
        return () => {
            if (instanceRef.current?.UI) instanceRef.current.UI.dispose?.();
            instanceRef.current = null;
            if (viewer.current) while (viewer.current.firstChild) viewer.current.removeChild(viewer.current.firstChild);
        };
    }, [setupWebViewer]);

    // --- Navigation, Drag ---
    const goToPage = (page: number) =>
        instanceRef.current?.Core.documentViewer.setCurrentPage(page);

    const handlePrev = () => currentPage > 1 && goToPage(currentPage - 1);
    const handleNext = () => currentPage < totalPages && goToPage(currentPage + 1);

    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        dragStartX.current = x;
    };
    const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
        if (dragStartX.current === null) return;
        const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
        const delta = x - dragStartX.current;
        if (Math.abs(delta) > 40) delta < 0 ? handleNext() : handlePrev();
        dragStartX.current = null;
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName || url.split('/').pop() || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            style={{
                position: 'relative', maxWidth: 480, width: '90vw', touchAction: 'pan-y',
                minHeight: 600, background: '#111', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
                overflow: 'hidden'
            }}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
        >
            {showExpand && (
                <button onClick={onExpand} className="absolute top-4 right-4 z-20 p-2 hover:bg-black/20 rounded" aria-label="View Full">
                    {ICON_EXPAND}
                </button>
            )}
            {showDownload && (
                <button onClick={handleDownload}
                    className="absolute top-4 right-4 z-20 p-2 hover:bg-black/20 rounded"
                    style={{ right: 60 }} aria-label="Download PDF">
                    {ICON_DOWNLOAD}
                </button>
            )}
            {overlay && (
                <button onClick={onCloseOverlay}
                    className="absolute top-4 left-4 z-20 p-2 hover:bg-black/20 rounded"
                    aria-label="Close">{ICON_CLOSE}</button>
            )}
            <div ref={viewer} className="webviewer !rounded-xl" style={{ height: 600, minHeight: 600, background: "#222" }} />
            {currentPage > 1 && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20" onClick={handlePrev} style={{ cursor: 'pointer' }}>
                    {ICON_ARROW('left')}
                </div>
            )}
            {currentPage < totalPages && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20" onClick={handleNext} style={{ cursor: 'pointer' }}>
                    {ICON_ARROW('right')}
                </div>
            )}
            {/* Pagination Footer */}
            <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pb-3">
                <div className="flex items-center gap-2 bg-black/70 rounded px-4 py-1 mb-1">
                    <span className="text-white font-semibold text-base" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {currentPage}
                    </span>
                    <span className="text-white/60 font-bold text-base">/</span>
                    <span className="text-white/60 font-semibold text-base">{totalPages}</span>
                </div>
            </div>
        </div>
    );
};

const LinkedinPDFCarousel: React.FC<LinkedinPDFCarouselProps> = ({ url, downloadName }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    return (
        <>
            <CarouselCore
                url={url}
                downloadName={downloadName}
                showExpand={true}
                showDownload={false}
                onExpand={() => setShowOverlay(true)}
            />
            {showOverlay && (
                <div
                    className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/95"
                    style={{ animation: 'fadeIn 0.2s' }}
                >
                    <CarouselCore
                        url={url}
                        downloadName={downloadName}
                        showExpand={false}
                        showDownload={true}
                        overlay={true}
                        onCloseOverlay={() => setShowOverlay(false)}
                    />
                </div>
            )}
            <style>
                {`
                @media (max-width: 600px) {
                    .webviewer { min-height: 65vw !important; }
                }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                `}
            </style>
        </>
    );
};

export default LinkedinPDFCarousel;