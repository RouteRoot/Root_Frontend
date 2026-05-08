"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/user";

const EDITOR_NAME = "뿌리 에디터";

export function useWikiEditorAccess() {
  const [isChecking, setIsChecking] = useState(true);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        if (mounted) {
          setIsEditor(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const me = await getMe();
        const editor =
          me.name === EDITOR_NAME || me.nickname === EDITOR_NAME;

        if (mounted) setIsEditor(editor);
      } catch {
        if (mounted) setIsEditor(false);
      } finally {
        if (mounted) setIsChecking(false);
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  return { isChecking, isEditor };
}
