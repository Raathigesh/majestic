const splitPanelCSS = `
.Resizer {
    background: #404148;
    opacity: .8;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
}

 .Resizer:hover {
    transition: all 2s ease;
}

 .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
}

.Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
}

.Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 3px solid rgba(255, 255, 255, 0.0);
    border-right: 3px solid rgba(255, 255, 255, 0.0);
    cursor: col-resize;
}

.Resizer.vertical:hover {
    border-left: 3px solid rgba(0, 0, 0, 0.5);
    border-right: 3px solid rgba(0, 0, 0, 0.5);
}
.Resizer.disabled {
  cursor: not-allowed;
}
.Resizer.disabled:hover {
  border-color: transparent;
}
`;

export default splitPanelCSS;
