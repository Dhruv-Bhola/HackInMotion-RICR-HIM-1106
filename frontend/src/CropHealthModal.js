'use client';

import { useState, useRef } from 'react';
import { analyzeCropHealth } from '@/lib/api';

export default function CropHealthModal({ onClose, userCrop }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('कृपया JPG या PNG छवि अपलोड करें।');
      return;
    }

    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    analyzeImage(file);
  };

  const analyzeImage = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeCropHealth(file, userCrop || 'गेहूं');
      setResult(data.result);
    } catch (err) {
      setError(err.message || 'विश्लेषण विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    none: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    low: 'bg-amber-50 border-amber-200 text-amber-800',
    medium: 'bg-orange-50 border-orange-200 text-orange-800',
    high: 'bg-red-50 border-red-200 text-red-800'
  };

  const resultStyle = result
    ? severityColors[result.severityLevel] || severityColors.medium
    : '';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex items-center gap-3 text-emerald-700 mb-4">
          <i className="fa-solid fa-notes-medical text-3xl"></i>
          <div>
            <h3 className="text-2xl font-bold heading-font">फसल स्वास्थ्य जांच (Crop Health)</h3>
            <p className="text-xs text-gray-500">AI नियम-आधारित विशेषज्ञ प्रणाली द्वारा रोग पहचान</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-6 text-center">
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-emerald-600 mb-2"></i>
            <p className="font-medium text-gray-700">प्रभावित फसल/पत्ती की फोटो अपलोड करें</p>
            <p className="text-xs text-gray-500 mb-3">(JPG या PNG प्रारूप)</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              {loading ? (
                <><i className="fa-solid fa-spinner fa-spin mr-1"></i> विश्लेषण हो रहा है...</>
              ) : (
                <>फोटो चुनें / कैमरा खोलें</>
              )}
            </button>
          </div>

          {preview && (
            <div className="rounded-xl overflow-hidden border border-emerald-100">
              <img src={preview} alt="Uploaded crop" className="w-full max-h-48 object-contain bg-gray-50" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              <i className="fa-solid fa-circle-exclamation mr-1"></i> {error}
            </div>
          )}

          {result && (
            <div className={`border rounded-xl p-4 space-y-3 ${resultStyle}`}>
              <div className="flex items-center gap-2 font-bold">
                {result.severityLevel === 'none' ? (
                  <i className="fa-solid fa-circle-check"></i>
                ) : (
                  <i className="fa-solid fa-triangle-exclamation"></i>
                )}
                <span>
                  {result.severityLevel === 'none'
                    ? 'फसल स्वस्थ है'
                    : `संभावित बीमारी: ${result.diseaseName}`}
                </span>
                <span className="ml-auto text-xs font-normal opacity-75">
                  {result.confidence}% विश्वास
                </span>
              </div>

              {result.symptoms?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1">लक्षण:</p>
                  <ul className="text-sm space-y-1">
                    {result.symptoms.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.treatment?.chemical && result.severityLevel !== 'none' && (
                <div>
                  <p className="text-sm font-semibold mb-1">उपचार की सलाह:</p>
                  <p className="text-sm">{result.treatment.chemical}</p>
                  {result.treatment.dosage && (
                    <p className="text-sm mt-1"><strong>मात्रा:</strong> {result.treatment.dosage}</p>
                  )}
                  {result.treatment.frequency && (
                    <p className="text-sm"><strong>आवृत्ति:</strong> {result.treatment.frequency}</p>
                  )}
                </div>
              )}

              {result.severityLevel === 'none' && result.treatment?.organic && (
                <p className="text-sm">{result.treatment.organic}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
