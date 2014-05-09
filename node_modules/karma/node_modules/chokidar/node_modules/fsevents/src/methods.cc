/*
** © 2014 by Philipp Dunkel <pip@pipobscure.com>
** Licensed under MIT License.
*/

void FSEvents::emitEvent(const char *path, UInt32 flags, UInt64 id) {
  if (!handler) return;
  NanScope();
  v8::Handle<v8::Value> argv[] = {
    v8::String::New(path),
    v8::Number::New(flags),
    v8::Number::New(id)
  };
  handler->Call(3, argv);
}

NAN_METHOD(FSEvents::New) {
  NanScope();

  char* path = NanFromV8String(args[0], Nan::UTF8, NULL, NULL, 0, v8::String::NO_OPTIONS);
  NanCallback *callback = new NanCallback(args[1].As<v8::Function>());
  
  FSEvents *fse = new FSEvents(path, callback);
  fse->Wrap(args.This());
  
  NanReturnValue(args.This());
}

NAN_METHOD(FSEvents::Stop) {
  NanScope();

  FSEvents* fse = node::ObjectWrap::Unwrap<FSEvents>(args.This());

  fse->asyncStop();
  fse->threadStop();

  NanReturnUndefined();
}

NAN_METHOD(FSEvents::Start) {
  NanScope();

  FSEvents* fse = node::ObjectWrap::Unwrap<FSEvents>(args.This());
  fse->asyncStart();
  fse->threadStart();
  
  NanReturnValue(args.This());
}
