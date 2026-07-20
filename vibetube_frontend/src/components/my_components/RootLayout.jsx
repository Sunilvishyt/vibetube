import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import nprogress from "nprogress";

nprogress.configure({ showSpinner: false });

export default function RootLayout() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "loading") {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }, [navigation.state]);

  return (
    <main>
      <Outlet />
    </main>
  );
}
