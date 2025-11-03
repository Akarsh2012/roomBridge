export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white/60">
      <div className="mx-auto max-w-6xl p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} RoomBridge. All rights reserved.
      </div>
    </footer>
  );
}

