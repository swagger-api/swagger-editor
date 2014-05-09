/*
** © 2014 by Philipp Dunkel <pip@pipobscure.com>
** Licensed under MIT License.
*/

#include "nan.h"
#include "uv.h"
#include "v8.h"
#include "pthread.h"
#include "CoreFoundation/CoreFoundation.h"
#include "CoreServices/CoreServices.h"
#include <iostream>

#include "src/storage.cc"

namespace fse {
  class FSEvents : public node::ObjectWrap {
  public:
    FSEvents(const char *path, NanCallback *handler);
    ~FSEvents();

    // locking.cc
    bool lockStarted;
    pthread_mutex_t lockmutex;
    void lockingStart();
    void lock();
    void unlock();
    void lockingStop();

    // async.cc
    uv_async_t async;
    void asyncStart();
    void asyncTrigger();
    void asyncStop();

    // thread.cc
    bool threadStarted;
    pthread_t thread;
    CFRunLoopRef threadloop;
    void threadStart();
    static void *threadRun(void *ctx);
    void threadStop();

    // methods.cc - internal
    NanCallback *handler;
    void emitEvent(const char *path, UInt32 flags, UInt64 id);

    // Common
    CFArrayRef paths;
    CFMutableArrayRef events;
    static void Initialize(v8::Handle<v8::Object> exports);
    
    // methods.cc - exposed
    static NAN_METHOD(New);
    static NAN_METHOD(Stop);
    static NAN_METHOD(Start);
      
  };
}

using namespace fse;

FSEvents::FSEvents(const char *path, NanCallback *handler): handler(handler) {
  CFStringRef dirs[] = { CFStringCreateWithCString(NULL, path, kCFStringEncodingUTF8) };
  paths = CFArrayCreate(NULL, (const void **)&dirs, 1, NULL);
  events = CFArrayCreateMutable(NULL, 0,  &FSEventArrayCallBacks);
  lockingStart();
}
FSEvents::~FSEvents() {
  lockingStop();
  delete handler;
  handler = NULL;

  CFRelease(paths);
  CFRelease(events);
}


#include "src/locking.cc"
#include "src/async.cc"
#include "src/thread.cc"
#include "src/constants.cc"
#include "src/methods.cc"

void FSEvents::Initialize(v8::Handle<v8::Object> exports) {
  v8::Local<v8::FunctionTemplate> tpl = v8::FunctionTemplate::New(FSEvents::New);
  tpl->SetClassName(NanSymbol("FSEvents"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "stop", FSEvents::Stop);
  NODE_SET_PROTOTYPE_METHOD(tpl, "start", FSEvents::Start);

  exports->Set(v8::String::NewSymbol("Constants"), Constants());
  exports->Set(v8::String::NewSymbol("FSEvents"), tpl->GetFunction());
}

NODE_MODULE(fse, FSEvents::Initialize)
