import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function BarcodePreview({ value }: { value: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    if (!value || value.length !== 13 || !/^\d{13}$/.test(value)) {
      svgRef.current.innerHTML = "";
      return;
    }

    try {
      JsBarcode(svgRef.current, value, {
        format: "EAN13",
        width: 2,
        height: 60,
        fontSize: 14,
        margin: 8,
      });
    } catch {
      svgRef.current.innerHTML = "";
    }
  }, [value]);

  return (
    <div className="bg-white border border-ink/10 rounded p-2 flex justify-center">
      <svg ref={svgRef} />
    </div>
  );
}
