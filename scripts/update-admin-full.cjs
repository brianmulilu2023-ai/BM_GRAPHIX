const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Sidebar and Mobile Drawer Avatar elements to have camera click-to-upload
const oldSidebarAvatarNeedle = `            {/* Profile Lockup */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10 relative z-10">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex-shrink-0 bg-black">
                <img
                  src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                  alt={adminUser?.name || 'Brian Mulilu'}
                  className="w-full h-full object-cover object-[center_18%]"
                />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
              </div>`;

const newSidebarAvatar = `            {/* Profile Lockup */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10 relative z-10">
              <div
                onClick={() => avatarFileInputRef.current?.click()}
                className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex-shrink-0 bg-black cursor-pointer group/avatar"
                title="Click to change profile photo"
              >
                <img
                  src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                  alt={adminUser?.name || 'Brian Mulilu'}
                  className="w-full h-full object-cover object-[center_18%] group-hover/avatar:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-[#F5D77A]">
                  <Camera className="w-5 h-5 drop-shadow" />
                </div>
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
              </div>`;

if (content.includes(oldSidebarAvatarNeedle)) {
  content = content.replace(oldSidebarAvatarNeedle, newSidebarAvatar);
  console.log('1. Updated desktop sidebar avatar with camera upload trigger.');
}

// Mobile top avatar
const oldMobileTopAvatarNeedle = `          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/40 flex-shrink-0 bg-black">
            <img
              src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
              alt="Admin"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>`;

const newMobileTopAvatar = `          <div
            onClick={() => avatarFileInputRef.current?.click()}
            className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/40 flex-shrink-0 bg-black cursor-pointer"
            title="Change photo"
          >
            <img
              src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
              alt="Admin"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>`;

if (content.includes(oldMobileTopAvatarNeedle)) {
  content = content.replace(oldMobileTopAvatarNeedle, newMobileTopAvatar);
  console.log('2. Updated mobile top avatar.');
}

// Mobile drawer avatar
const oldMobileDrawerAvatarNeedle = `                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-black flex-shrink-0">
                      <img
                        src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                        alt="Brian Mulilu"
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                    </div>`;

const newMobileDrawerAvatar = `                    <div
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-black flex-shrink-0 cursor-pointer group/avatar"
                      title="Click to change photo"
                    >
                      <img
                        src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                        alt="Brian Mulilu"
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-[#F5D77A]">
                        <Camera className="w-4 h-4 drop-shadow" />
                      </div>
                    </div>`;

if (content.includes(oldMobileDrawerAvatarNeedle)) {
  content = content.replace(oldMobileDrawerAvatarNeedle, newMobileDrawerAvatar);
  console.log('3. Updated mobile drawer avatar.');
}

// Add hidden file input for avatar right before closing </main>
const hiddenAvatarInput = `        {/* Hidden Global Avatar Uploader */}
        <input
          type="file"
          ref={avatarFileInputRef}
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleAvatarFileChange}
          className="hidden"
        />
        </main>`;

if (content.includes('</main>') && !content.includes('avatarFileInputRef}')) {
  content = content.replace('</main>', hiddenAvatarInput);
  console.log('4. Added hidden avatar input before </main>.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Avatar triggers updated.');
