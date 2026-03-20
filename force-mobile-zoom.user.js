// ==UserScript==
// @name         Force two-finger zoom on mobile web pages 强制手机网页双指缩放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制缩放 + 自动修复滚动容器（兼容所有主流网站）Force zoom + auto-fix scroll containers (Compatible with all major websites)
// @author       Manning9264
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABd0lEQVR4nO2WX0oCURjFfyj6kvVqtIRsD9UGsiKsHURmZS0iwmX0x9aTRZYptIBeIh/yReODM3ARyubeaSTwwIUZ5p5zvrnfN4eBGf4x8kAFaAJPQF/Lrm/0zPb8CbaBHjCasLrAVpLGGaDhGNwBx8AyMKdVAk6AlrPvQtxgNCT4CexPELVnB9obFRF87CMJrsbgrTlFbPqa552e25vHRVXcFyDnU0DF6blPL7PAvTR2fAq4FfkIf9Slce1DfhbZpt0XJWlYTsTGh8iFgALmpWFasdFPoIAFabz7kHsJtGAlpAVNkS3hfHEmjUsf8p7IrYDP8CHkM8wBrxKweI2Lmrgd3yAylJ0otnj9LdaBATAENgjAIvDmFFHV0X6HrN58IM55qHlbQlERI8VrXSFT0LJpP3V6PpR5Jgnztu7Lzkz8tDpJHHt7zDyCDdOufr+6CitLuUfgStPuPXCGonOMFh5LpIjizJwpmLuJNT5wqeJwmuYzkDa+AO0YhpRFIZffAAAAAElFTkSuQmCC
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @supportURL   https://github.com/Hurricane-0121/Force-mobile-zoom/issues
// @downloadURL  https://github.com/Hurricane-0121/Force-mobile-zoom/raw/refs/heads/main/force-mobile-zoom.user.js
// @updateURL    https://github.com/Hurricane-0121/Force-mobile-zoom/raw/refs/heads/main/force-mobile-zoom.user.js
// ==/UserScript==

(function() {
    'use strict';

    const FORCED_MAX_SCALE = '10.0';
    const FORCED_USER_SCALABLE = 'yes';

    // ---------- 修正 viewport meta ----------
    function fixViewportMeta(metaNode) {
        if (!metaNode || metaNode.name !== 'viewport') return;
        let content = metaNode.getAttribute('content') || '';
        if (!content.trim()) {
            metaNode.setAttribute('content', `width=device-width, initial-scale=1.0, maximum-scale=${FORCED_MAX_SCALE}, user-scalable=${FORCED_USER_SCALABLE}`);
            return;
        }
        let parts = content.split(',').map(part => part.trim()).filter(part => part.length > 0);
        let newParts = [];
        let foundUserScalable = false,
            foundMaxScale = false,
            foundWidth = false;

        for (let part of parts) {
            let eqIndex = part.indexOf('=');
            if (eqIndex > 0) {
                let key = part.substring(0, eqIndex).trim().toLowerCase();
                if (key === 'user-scalable') {
                    newParts.push(`user-scalable=${FORCED_USER_SCALABLE}`);
                    foundUserScalable = true;
                } else if (key === 'maximum-scale') {
                    newParts.push(`maximum-scale=${FORCED_MAX_SCALE}`);
                    foundMaxScale = true;
                } else if (key === 'width') {
                    newParts.push(part);
                    foundWidth = true;
                } else {
                    newParts.push(part);
                }
            } else {
                newParts.push(part);
            }
        }
        if (!foundUserScalable) newParts.push(`user-scalable=${FORCED_USER_SCALABLE}`);
        if (!foundMaxScale) newParts.push(`maximum-scale=${FORCED_MAX_SCALE}`);
        if (!foundWidth) newParts.push(`width=device-width`);

        metaNode.setAttribute('content', newParts.join(', '));
    }

    function ensureViewportMeta() {
        let metaList = document.querySelectorAll('meta[name="viewport"]');
        if (metaList.length > 0) {
            metaList.forEach(meta => fixViewportMeta(meta));
        } else if (document.head) {
            let newMeta = document.createElement('meta');
            newMeta.name = 'viewport';
            newMeta.setAttribute('content', `width=device-width, initial-scale=1.0, maximum-scale=${FORCED_MAX_SCALE}, user-scalable=${FORCED_USER_SCALABLE}`);
            document.head.appendChild(newMeta);
        } else {
            let headObserver = new MutationObserver(function(mutations, obs) {
                if (document.head) {
                    obs.disconnect();
                    ensureViewportMeta();
                }
            });
            headObserver.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // ---------- 暴力修复滚动：强制所有可能滚动的元素拥有正确的 overflow ----------
    function forceScrollOnAllElements() {
        let allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
            let scrollHeight = el.scrollHeight;
            let clientHeight = el.clientHeight;
            if (scrollHeight > clientHeight) {
                el.style.setProperty('overflow-y', 'auto', 'important');
                el.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
                el.style.setProperty('touch-action', 'manipulation', 'important');
            }
        });
    }

    // 定期扫描（应对动态内容）
    function startPeriodicScan() {
        setInterval(forceScrollOnAllElements, 2000);
    }

    // 观察 DOM 变化，增量修复
    function observeDynamicContent() {
        if (!document.body) {
            setTimeout(observeDynamicContent, 100);
            return;
        }
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            let elements = node.querySelectorAll ? node.querySelectorAll('*') : [];
                            [node, ...elements].forEach(el => {
                                if (el.scrollHeight > el.clientHeight) {
                                    el.style.setProperty('overflow-y', 'auto', 'important');
                                    el.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
                                    el.style.setProperty('touch-action', 'manipulation', 'important');
                                }
                            });
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 启动所有修复
    function init() {
        if (document.head) {
            ensureViewportMeta();
        } else {
            let headReadyObserver = new MutationObserver(function(mutations, obs) {
                if (document.head) {
                    obs.disconnect();
                    ensureViewportMeta();
                }
            });
            headReadyObserver.observe(document.documentElement, { childList: true, subtree: true });
        }

        if (document.body) {
            forceScrollOnAllElements();
            startPeriodicScan();
            observeDynamicContent();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                forceScrollOnAllElements();
                startPeriodicScan();
                observeDynamicContent();
            });
        }
        window.addEventListener('load', forceScrollOnAllElements);
    }

    init();
})();
