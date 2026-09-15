"""Small cross-platform advisory file lock for local automation state."""
from __future__ import annotations

from contextlib import contextmanager
import os
from pathlib import Path


class LockUnavailable(RuntimeError):
    pass


@contextmanager
def exclusive_lock(path: Path, *, blocking: bool = True):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+b") as handle:
        handle.seek(0, os.SEEK_END)
        if not handle.tell():
            handle.write(b"0")
            handle.flush()
        if os.name == "nt":
            import msvcrt

            mode = msvcrt.LK_LOCK if blocking else msvcrt.LK_NBLCK
            try:
                handle.seek(0)
                msvcrt.locking(handle.fileno(), mode, 1)
            except OSError as error:
                raise LockUnavailable(path) from error
            unlock = lambda: msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl

            try:
                fcntl.flock(handle, fcntl.LOCK_EX | (0 if blocking else fcntl.LOCK_NB))
            except BlockingIOError as error:
                raise LockUnavailable(path) from error
            unlock = lambda: fcntl.flock(handle, fcntl.LOCK_UN)
        try:
            yield
        finally:
            unlock()
