import React, { useState, useEffect } from 'react';

export default function App() {
  // States
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [healthResultVisible, setHealthResultVisible] = useState(false);
  const [advisoryMode, setAdvisoryMode] = useState('balanced');
  const [advisoryCrop, setAdvisoryCrop] = useState('');
  const [advisorySoil, setAdvisorySoil] = useState('दोमट');
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Form States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    state: '',
    crop: '',
    password: ''
  });

  // Check LocalStorage on Load
  useEffect(() => {
    const storedUser = localStorage.getItem('kisanUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setActiveSection('dashboard');
    }
  }, []);

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('kisanUser'));

    if (storedUser && storedUser.phone === loginPhone && storedUser.password === loginPassword) {
      setCurrentUser(storedUser);
      setActiveSection('dashboard');
      fetchWeather(storedUser.state);
    } else if (!storedUser) {
      const demoUser = {
        name: "किसान भाई",
        phone: loginPhone,
        state: "उत्तर प्रदेश",
        crop: "गेहूं"
      };
      localStorage.setItem('kisanUser', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      setActiveSection('dashboard');
      fetchWeather(demoUser.state);
    } else {
      alert('गलत मोबाइल नंबर या पासवर्ड! कृपया पुनः प्रयास करें।');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('kisanUser', JSON.stringify(regData));
    setCurrentUser(regData);
    alert(`बधाई हो ${regData.name}! आपका पंजीकरण सफलतापूर्वक हो गया है।`);
    setActiveSection('dashboard');
  };

  const stateCoordinates = {
    'उत्तर प्रदेश': { lat: 26.85, lon: 80.95 },
    'मध्य प्रदेश': { lat: 23.25, lon: 77.41 },
    'बिहार': { lat: 25.60, lon: 85.14 },
    'राजस्थान': { lat: 26.91, lon: 75.79 },
    'हरियाणा': { lat: 29.06, lon: 76.08 },
    'पंजाब': { lat: 30.90, lon: 75.85 }
  };

  const fetchWeather = async (stateName) => {
    const place = stateCoordinates[stateName] || stateCoordinates['मध्य प्रदेश'];
    setWeatherLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather request failed');
      setWeather(await response.json());
    } catch (error) {
      console.error(error);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const weatherText = (code) => {
    if (code === 0) return 'साफ आसमान';
    if ([1,2,3].includes(code)) return 'आंशिक बादल';
    if ([45,48].includes(code)) return 'कोहरा';
    if ([51,53,55,56,57].includes(code)) return 'हल्की बूंदाबांदी';
    if ([61,63,65,66,67,80,81,82].includes(code)) return 'बारिश';
    if ([95,96,99].includes(code)) return 'गरज के साथ बारिश';
    return 'मौसम सामान्य';
  };

  const generateAdvisory = () => {
    const crop = advisoryCrop || currentUser?.crop || 'गेहूं';
    const advice = {
      economical: {
        title: 'किफायती खेती योजना',
        points: [`फसल: ${crop} | मिट्टी: ${advisorySoil}`,
          'मृदा जांच के आधार पर ही उर्वरक दें और अनावश्यक इनपुट खर्च कम करें।',
          'स्थानीय उपलब्ध जैविक खाद/कम्पोस्ट का उपयोग करें।',
          'सिंचाई का समय मौसम पूर्वानुमान देखकर तय करें।']
      },
      sustainable: {
        title: 'पर्यावरण-अनुकूल खेती योजना',
        points: [`फसल: ${crop} | मिट्टी: ${advisorySoil}`,
          'जैविक खाद, कम्पोस्ट और फसल अवशेष प्रबंधन को प्राथमिकता दें।',
          'कीट नियंत्रण में पहले निगरानी और जैविक उपाय अपनाएं।',
          'मिट्टी की नमी बचाने के लिए मल्चिंग और संतुलित सिंचाई करें।']
      },
      balanced: {
        title: 'संतुलित खेती योजना',
        points: [`फसल: ${crop} | मिट्टी: ${advisorySoil}`,
          'उत्पादन, लागत और मिट्टी के स्वास्थ्य के बीच संतुलन रखें।',
          'मृदा जांच के अनुसार उर्वरक की मात्रा तय करें।',
          'मौसम और मंडी भाव देखकर सिंचाई तथा बिक्री का समय चुनें।']
      }
    };
    setAdvisoryResult(advice[advisoryMode]);
  };

  const handleLogout = () => {
    localStorage.removeItem('kisanUser');
    setCurrentUser(null);
    setActiveSection('home');
  };

  const handleRegChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f2f7f2] font-['Hind',sans-serif]">
      
      {/* HEADER NAVIGATION */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveSection(currentUser ? 'dashboard' : 'home')}
          >
            <div className="bg-amber-400 p-2.5 rounded-full text-emerald-900 text-xl font-bold">
              <i className="fa-solid fa-wheat-awn"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-['Tiro_Devanagari_Hindi',serif] tracking-wide">किसान मित्र</h1>
              <p className="text-xs text-emerald-200">आपकी अपनी डिजिटल खेती सेवा</p>
            </div>
          </div>

          {!currentUser ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveSection('login')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition border border-emerald-500"
              >
                <i className="fa-solid fa-right-to-bracket mr-1"></i> लॉगिन करें
              </button>
              <button 
                onClick={() => setActiveSection('register')} 
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 px-4 py-2 rounded-lg text-sm font-semibold transition shadow"
              >
                <i className="fa-solid fa-user-plus mr-1"></i> नया खाता बनाएं
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-emerald-100 font-medium">किसान: {currentUser.name}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                <i className="fa-solid fa-power-off mr-1"></i> लॉगआउट
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">

        {/* 1. HOME SECTION */}
        {activeSection === 'home' && (
          <section className="bg-gradient-to-r from-emerald-900/80 to-black/80 bg-cover bg-center min-h-[88vh] flex items-center justify-center px-4 py-12 relative" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop')` }}>
            <div className="max-w-3xl text-center text-white space-y-6">
              <span className="bg-emerald-700/80 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium border border-amber-400/30">
                🌱 स्मार्ट कृषि समाधान
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-['Tiro_Devanagari_Hindi',serif] leading-tight">
                डिजिटल तकनीक से सशक्त बनता हमारा भारतीय किसान
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                फसल स्वास्थ्य की जांच, सटीक मौसम और मिट्टी रिपोर्ट, तथा देश की मंडियों के ताजा भाव अब एक ही स्थान पर उपलब्ध हैं।
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button onClick={() => setActiveSection('login')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl text-lg font-bold shadow-xl transition flex items-center justify-center gap-2">
                  <i className="fa-solid fa-right-to-bracket"></i> लॉगिन करके शुरू करें
                </button>
                <button onClick={() => setActiveSection('register')} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-8 py-3.5 rounded-xl text-lg font-bold shadow-xl transition flex items-center justify-center gap-2">
                  <i className="fa-solid fa-id-card"></i> नया किसान पंजीकरण
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 2. LOGIN SECTION */}
        {activeSection === 'login' && (
          <section className="min-h-[85vh] flex items-center justify-center px-4 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                  <i className="fa-solid fa-user-lock"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif]">किसान लॉगिन</h3>
                <p className="text-gray-500 text-sm">अपने पंजीकृत मोबाइल नंबर से प्रवेश करें</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल नंबर</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <input 
                      type="tel" 
                      required 
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="10 अंकों का मोबाइल नंबर" 
                      pattern="[0-9]{10}" 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      required 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="अपना पासवर्ड दर्ज करें" 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg shadow-md transition">
                  लॉगिन करें
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                खाता नहीं है? {' '}
                <button onClick={() => setActiveSection('register')} className="text-emerald-700 font-bold hover:underline">
                  यहाँ नया पंजीकरण करें
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. REGISTRATION SECTION */}
        {activeSection === 'register' && (
          <section className="min-h-[85vh] flex items-center justify-center px-4 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                  <i className="fa-solid fa-address-card"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif]">किसान पंजीकरण</h3>
                <p className="text-gray-500 text-sm">पोर्टल की सुविधाओं का लाभ उठाने के लिए विवरण भरें</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">किसान का पूरा नाम</label>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    value={regData.name}
                    onChange={handleRegChange}
                    placeholder="उदा. राम प्रसाद" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल नंबर</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={regData.phone}
                      onChange={handleRegChange}
                      placeholder="10 अंकों का नंबर" 
                      pattern="[0-9]{10}" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">राज्य</label>
                    <select 
                      name="state"
                      required 
                      value={regData.state}
                      onChange={handleRegChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="">राज्य चुनें</option>
                      <option value="उत्तर प्रदेश">उत्तर प्रदेश</option>
                      <option value="मध्य प्रदेश">मध्य प्रदेश</option>
                      <option value="बिहार">बिहार</option>
                      <option value="राजस्थान">राजस्थान</option>
                      <option value="हरियाणा">हरियाणा</option>
                      <option value="पंजाब">पंजाब</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">मुख्य फसल</label>
                  <select 
                    name="crop"
                    required 
                    value={regData.crop}
                    onChange={handleRegChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="">मुख्य फसल का चयन करें</option>
                    <option value="गेहूं">गेहूं (Wheat)</option>
                    <option value="धान (चावल)">धान / चावल (Paddy)</option>
                    <option value="मक्का">मक्का (Maize)</option>
                    <option value="सरसों">सरसों (Mustard)</option>
                    <option value="आलू">आलू (Potato)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड बनाएं</label>
                  <input 
                    type="password" 
                    name="password"
                    required 
                    value={regData.password}
                    onChange={handleRegChange}
                    placeholder="पासवर्ड लिखें" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-3 rounded-lg shadow-md transition">
                  खाता बनाएं और प्रवेश करें
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                पहले से खाता है? {' '}
                <button onClick={() => setActiveSection('login')} className="text-emerald-700 font-bold hover:underline">
                  यहाँ लॉगिन करें
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. DASHBOARD SECTION */}
        {activeSection === 'dashboard' && currentUser && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="bg-emerald-600 text-emerald-100 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">सक्रिय किसान प्रोफ़ाइल</span>
                <h2 className="text-3xl md:text-4xl font-bold font-['Tiro_Devanagari_Hindi',serif] mt-2">
                  नमस्ते, {currentUser.name} जी!
                </h2>
                <p className="text-emerald-200 text-base mt-1">
                  मुख्य फसल: {currentUser.crop} | राज्य: {currentUser.state}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[200px]">
                <p className="text-xs text-emerald-200">आज का मौसम पूर्वानुमान</p>
                <p className="text-2xl font-bold mt-1"><i className="fa-solid fa-cloud-sun text-amber-300 mr-2"></i>28°C</p>
                <p className="text-xs text-emerald-100">साफ मौसम (सिंचाई हेतु अनुकूल)</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif] flex items-center gap-2">
                <i className="fa-solid fa-grip text-emerald-700"></i> किसान मुख्य सेवाएं
              </h3>
              <p className="text-gray-600">नीचे दिए गए तीनों बॉक्स में से अपनी आवश्यकता अनुसार चुनें:</p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* CARD 1 */}
              <div 
                onClick={() => setActiveModal('cropHealth')} 
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-md hover:border-emerald-500 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-3xl mb-4">
                    <i className="fa-solid fa-seedling"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif] mb-2">1. फसल स्वास्थ्य (Crop Health)</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    फसल में लगने वाले कीट, रोग या पत्तियों के पीलेपन का तुरंत निदान करें। फोटो अपलोड करें और उचित दवा की जानकारी पाएं।
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-emerald-700 font-bold">
                  <span>स्वास्थ्य जांचें</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>

              {/* CARD 2 */}
              <div 
                onClick={() => setActiveModal('report')} 
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-2xl p-6 border-2 border-teal-100 shadow-md hover:border-teal-500 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center text-3xl mb-4">
                    <i className="fa-solid fa-file-invoice"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif] mb-2">2. फसल रिपोर्ट (Report)</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    अपनी मिट्टी की उर्वरता (Soil Health Card), खाद-उर्वरक की सही मात्रा एवं सरकारी योजनाओं की संपूर्ण रिपोर्ट प्राप्त करें।
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-teal-700 font-bold">
                  <span>रिपोर्ट देखें</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>

              {/* CARD 3 */}
              <div 
                onClick={() => setActiveModal('market')} 
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-2xl p-6 border-2 border-amber-100 shadow-md hover:border-amber-500 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-3xl mb-4">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif] mb-2">3. मंडी भाव (Market)</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    अपने नजदीकी मंडी के आज के न्यूनतम व उच्चतम भाव देखें। सही समय पर सही दाम में अपनी उपज बेचें।
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-amber-800 font-bold">
                  <span>ताजा भाव देखें</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>

            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-800 font-['Tiro_Devanagari_Hindi',serif] flex items-center gap-2 mb-2">
                ✨ स्मार्ट सुविधाएं
              </h3>
              <p className="text-gray-600 mb-5">CropCare की अतिरिक्त सुविधाएं एक ही जगह पर इस्तेमाल करें।</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div onClick={() => { setAdvisoryCrop(currentUser.crop); setAdvisoryResult(null); setActiveModal('advisory'); }}
                  className="bg-white rounded-2xl p-5 border-2 border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-bold text-lg">फसल सलाह</h4>
                  <p className="text-sm text-gray-600 mt-1">किफायती, टिकाऊ या संतुलित खेती योजना पाएं।</p>
                </div>

                <div onClick={() => { fetchWeather(currentUser.state); setActiveModal('weather'); }}
                  className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
                  <div className="text-3xl mb-3">🌤️</div>
                  <h4 className="font-bold text-lg">मौसम</h4>
                  <p className="text-sm text-gray-600 mt-1">वर्तमान और 3 दिन का मौसम पूर्वानुमान।</p>
                </div>


              </div>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm border-t border-gray-800 mt-12">
        <p>© 2026 किसान मित्र डिजिटल सेवा पोर्टल | सभी अधिकार सुरक्षित</p>
        <p className="text-xs text-gray-500 mt-1">भारतीय किसानों की उन्नति के लिए समर्पित</p>
      </footer>

      {/* MODAL POPUPS */}

      {/* SMART ADVISORY MODAL */}
      {activeModal === 'advisory' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 text-xl w-8 h-8 rounded-full bg-gray-100">✕</button>
            <h3 className="text-2xl font-bold text-emerald-800 mb-1">🎯 स्मार्ट फसल सलाह</h3>
            <p className="text-sm text-gray-500 mb-5">फसल, मिट्टी और चुने हुए खेती मोड के आधार पर सलाह।</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">फसल</label>
                <select value={advisoryCrop} onChange={e => setAdvisoryCrop(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg">
                  <option value="">फसल चुनें</option>
                  <option value="गेहूं">गेहूं</option><option value="धान">धान</option>
                  <option value="मक्का">मक्का</option><option value="सरसों">सरसों</option><option value="आलू">आलू</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">मिट्टी</label>
                <select value={advisorySoil} onChange={e => setAdvisorySoil(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg">
                  <option>दोमट</option><option>चिकनी मिट्टी</option><option>बलुई मिट्टी</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {[['economical','💰','किफायती'],['sustainable','🌱','पर्यावरण-अनुकूल'],['balanced','⚖️','संतुलित']].map(([value,icon,label]) => (
                <button key={value} onClick={() => setAdvisoryMode(value)}
                  className={`p-3 rounded-xl border-2 font-bold ${advisoryMode === value ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200'}`}>
                  {icon} {label}
                </button>
              ))}
            </div>

            <button onClick={generateAdvisory} className="w-full mt-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg">
              सलाह तैयार करें
            </button>

            {advisoryResult && (
              <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex justify-between items-center gap-3">
                  <h4 className="font-bold text-lg text-emerald-900">{advisoryResult.title}</h4>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {advisoryResult.points.map((point,i) => <li key={i}>✓ {point}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEATHER MODAL */}
      {activeModal === 'weather' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 text-xl w-8 h-8 rounded-full bg-gray-100">✕</button>
            <h3 className="text-2xl font-bold text-blue-800">🌤️ लाइव मौसम जानकारी</h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">{currentUser?.state}</p>
            {weatherLoading ? <div className="text-center py-10">मौसम डेटा लोड हो रहा है...</div> :
             weather ? <>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <div className="text-5xl font-bold text-blue-800">{Math.round(weather.current.temperature_2m)}°C</div>
                <div className="font-semibold mt-1">{weatherText(weather.current.weather_code)}</div>
                <div className="text-sm text-gray-600 mt-2">नमी: {weather.current.relative_humidity_2m}% · हवा: {Math.round(weather.current.wind_speed_10m)} km/h · बारिश: {weather.current.precipitation} mm</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {weather.daily.time.map((day,i) => (
                  <div key={day} className="border rounded-xl p-3 text-center">
                    <div className="font-bold">{new Date(day).toLocaleDateString('hi-IN',{weekday:'short'})}</div>
                    <div className="text-sm mt-1">↑ {Math.round(weather.daily.temperature_2m_max[i])}°</div>
                    <div className="text-sm">↓ {Math.round(weather.daily.temperature_2m_min[i])}°</div>
                    <div className="text-xs text-blue-700 mt-1">🌧️ {weather.daily.precipitation_probability_max[i]}%</div>
                  </div>
                ))}
              </div>
             </> :
             <div className="bg-amber-50 p-4 rounded-xl text-amber-800">मौसम डेटा उपलब्ध नहीं है। इंटरनेट कनेक्शन जांचें।</div>}
          </div>
        </div>
      )}

      {/* MODAL 1: CROP HEALTH */}
      {activeModal === 'cropHealth' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => { setActiveModal(null); setHealthResultVisible(false); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="flex items-center gap-3 text-emerald-700 mb-4">
              <i className="fa-solid fa-notes-medical text-3xl"></i>
              <div>
                <h3 className="text-2xl font-bold font-['Tiro_Devanagari_Hindi',serif]">फसल स्वास्थ्य जांच (Crop Health)</h3>
                <p className="text-xs text-gray-500">एआई (AI) द्वारा फसल रोग की तत्काल पहचान</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-6 text-center">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-emerald-600 mb-2"></i>
                <p className="font-medium text-gray-700">प्रभावित फसल/पत्ती की फोटो अपलोड करें</p>
                <p className="text-xs text-gray-500 mb-3">(JPG या PNG प्रारूप)</p>
                <input 
                  type="file" 
                  id="cropImgInput" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={() => setHealthResultVisible(true)}
                />
                <button 
                  onClick={() => document.getElementById('cropImgInput').click()} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                >
                  फोटो चुनें / कैमरा खोलें
                </button>
              </div>

              {healthResultVisible && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>संभावित बीमारी: झुलसा रोग (Leaf Blight)</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>लक्षण:</strong> पत्तियों पर भूरे और काले धब्बे बनना।
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>उपचार की सलाह:</strong> कॉपर ऑक्सीक्लोराइड 50% WP (3 ग्राम प्रति लीटर पानी) का छिड़काव करें। 10 दिन बाद दोहराएं।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REPORT */}
      {activeModal === 'report' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="flex items-center gap-3 text-teal-700 mb-4">
              <i className="fa-solid fa-file-circle-check text-3xl"></i>
              <div>
                <h3 className="text-2xl font-bold font-['Tiro_Devanagari_Hindi',serif]">किसान मृदा व खाद रिपोर्ट (Report)</h3>
                <p className="text-xs text-gray-500">मृदा स्वास्थ्य कार्ड एवं सरकारी योजना स्थिति</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-vial-virus text-teal-600"></i> मृदा जांच रिपोर्ट (Soil Test Summary)
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white p-2 rounded border">
                    <span className="block text-gray-500 text-xs">pH स्तर</span>
                    <span className="font-bold text-emerald-700">6.8 (सामान्य)</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="block text-gray-500 text-xs">नाइट्रोजन</span>
                    <span className="font-bold text-amber-600">मध्यम</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="block text-gray-500 text-xs">फास्फोरस</span>
                    <span className="font-bold text-emerald-700">पर्याप्त</span>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                <h4 className="font-bold text-teal-900 mb-1">पीएम-किसान सम्मान निधि</h4>
                <p className="text-xs text-teal-800">अगली किश्त (Installment) स्थिति: <span className="font-bold text-emerald-700">स्वीकृत (Approved)</span></p>
              </div>

              <button 
                onClick={() => alert('आपकी पूर्ण PDF रिपोर्ट डाउनलोड हो रही है...')} 
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-download"></i> पूर्ण रिपोर्ट PDF डाउनलोड करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MARKET */}
      {activeModal === 'market' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="flex items-center gap-3 text-amber-800 mb-4">
              <i className="fa-solid fa-store text-3xl"></i>
              <div>
                <h3 className="text-2xl font-bold font-['Tiro_Devanagari_Hindi',serif]">आज के ताजा मंडी भाव (Live Market)</h3>
                <p className="text-xs text-gray-500">दाम प्रति क्विंटल (₹/Quintal) में दर्ज हैं</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-100 text-amber-900 font-bold border-b border-amber-200">
                    <th className="p-3">फसल</th>
                    <th className="p-3">मंडी</th>
                    <th className="p-3">न्यूनतम भाव</th>
                    <th className="p-3">अधिकतम भाव</th>
                    <th className="p-3">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">गेहूं (Wheat)</td>
                    <td className="p-3">कानपुर मंडी</td>
                    <td className="p-3">₹2,250</td>
                    <td className="p-3 font-bold text-emerald-700">₹2,420</td>
                    <td className="p-3 text-emerald-600"><i className="fa-solid fa-caret-up mr-1"></i>बढ़त</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">धान (Paddy)</td>
                    <td className="p-3">करनाल मंडी</td>
                    <td className="p-3">₹2,180</td>
                    <td className="p-3 font-bold text-emerald-700">₹2,350</td>
                    <td className="p-3 text-emerald-600"><i className="fa-solid fa-caret-up mr-1"></i>स्थिर</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">सरसों (Mustard)</td>
                    <td className="p-3">जयपुर मंडी</td>
                    <td className="p-3">₹5,100</td>
                    <td className="p-3 font-bold text-emerald-700">₹5,450</td>
                    <td className="p-3 text-emerald-600"><i className="fa-solid fa-caret-up mr-1"></i>बढ़त</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">आलू (Potato)</td>
                    <td className="p-3">आगरा मंडी</td>
                    <td className="p-3">₹1,200</td>
                    <td className="p-3 font-bold text-emerald-700">₹1,450</td>
                    <td className="p-3 text-red-500"><i className="fa-solid fa-caret-down mr-1"></i>गिरावट</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}